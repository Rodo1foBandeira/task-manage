import SkeletonRows from "@/components/dataDisplay/Table/SkeletonRows";
import Tarefas from "./Table";
import { Grid2, Typography } from "@mui/material";
import Form from "./Form";

export default function Loading(){
    return (
        <Grid2 container direction="column" spacing={2}>
      <Grid2>
        <Typography variant="h3"> Tarefas</Typography>
      </Grid2>
      <Grid2>
        <Form />
      </Grid2>
      <Grid2>
        <Tarefas>
          <SkeletonRows rowRepeat={2} colRepeat={6} />
        </Tarefas>
      </Grid2>
    </Grid2>
    )
}